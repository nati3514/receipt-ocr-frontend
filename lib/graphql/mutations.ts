import { gql } from "@apollo/client";

export const UPLOAD_RECEIPT = gql`
  mutation UploadReceipt($file: Upload!) {
    uploadReceipt(file: $file) {
      id
      storeName
      totalAmount
      purchaseDate
      imageUrl
      createdAt
      items {
        id
        name
        price
        quantity
      }
    }
  }
`;
