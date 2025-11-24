import { gql } from "@apollo/client";

export const GET_RECEIPTS = gql`
  query GetReceipts {
    receipts {
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

export const GET_RECEIPT = gql`
  query GetReceipt($id: ID!) {
    receipt(id: $id) {
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
