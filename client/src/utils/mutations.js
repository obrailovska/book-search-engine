import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook(
    $title: String!
    $description: String!
    $bookId: String!
    $authors: [String]!
    $image: String!
    $link: String!
  ) {
    saveBook(
      title: $title
      description: $description
      bookId: $bookId
      authors: $authors
      image: $image
      link: $link
    ) {
      _id
      title
      description
      bookId
      authors
      image
      link
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      title
      authors
      description
      bookId
      image
      link
    }
  }
`;
