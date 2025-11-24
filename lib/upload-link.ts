import { ApolloLink, Observable, HttpLink } from '@apollo/client';

function isExtractableFile(value: any): boolean {
    return (
        (typeof File !== 'undefined' && value instanceof File) ||
        (typeof Blob !== 'undefined' && value instanceof Blob)
    );
}

function extractFiles(value: any, path: string[] = [], files: Map<any, string[]> = new Map()): { clone: any; files: Map<any, string[]> } {
    if (isExtractableFile(value)) {
        const filePath = ['variables', ...path];
        files.set(value, filePath);
        return { clone: null, files };
    }

    if (Array.isArray(value)) {
        const clone: any[] = [];
        value.forEach((item, index) => {
            const result = extractFiles(item, [...path, String(index)], files);
            clone.push(result.clone);
        });
        return { clone, files };
    }

    if (value !== null && typeof value === 'object') {
        const clone: any = {};
        Object.keys(value).forEach((key) => {
            const result = extractFiles(value[key], [...path, key], files);
            clone[key] = result.clone;
        });
        return { clone, files };
    }

    return { clone: value, files };
}

export const createUploadLink = ({ uri, headers }: { uri: string; headers?: Record<string, string> }) => {
    const httpLink = new HttpLink({ uri, headers });

    return new ApolloLink((operation, forward) => {
        // Extract files from variables
        const { clone: variables, files } = extractFiles(operation.variables || {});

        // If no files, use regular HTTP link
        if (files.size === 0) {
            return httpLink.request(operation, forward) || forward(operation);
        }

        // Handle file upload with multipart/form-data
        return new Observable((observer) => {
            const formData = new FormData();

            // Convert Map to Array
            const filesArray = Array.from(files.entries());

            // Build operations object - file variables MUST be null
            const operations = {
                query: operation.query.loc?.source.body || '',
                variables,
                operationName: operation.operationName,
            };

            // Build map object
            const map: Record<string, string[]> = {};
            filesArray.forEach(([file, path], index) => {
                map[String(index)] = path;
            });

            // CRITICAL ORDER: operations -> map -> files
            formData.append('operations', JSON.stringify(operations));
            formData.append('map', JSON.stringify(map));

            // Append files
            filesArray.forEach(([file, path], index) => {
                formData.append(String(index), file, (file as File).name);
            });

            // Debug logging
            console.log('📤 Upload Request Debug:', {
                operationsJSON: JSON.stringify(operations, null, 2),
                mapJSON: JSON.stringify(map, null, 2),
                filesCount: filesArray.length,
                fileNames: filesArray.map(([f]) => (f as File).name)
            });

            // Fetch
            fetch(uri, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Apollo-Require-Preflight': 'true',
                },
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP ${response.status}: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then((result) => {
                    console.log('✅ Upload Success:', result);
                    observer.next(result);
                    observer.complete();
                })
                .catch((error) => {
                    console.error('❌ Upload Error:', error);
                    observer.error(error);
                });
        });
    });
};
