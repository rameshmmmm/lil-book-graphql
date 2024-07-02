const LilBookTypeDef = `#graphql
  type LilBook {
    _id: ID!
    title: String!
    details: String!
    type: String!
  }

  type Query {
    lilBooks: [LilBook!]
    lilBook(lilBookId:ID!): LilBook
  }

  type Mutation {
  createLilBook(input: CreateLilBookInput!): LilBook!
    updateLilBook(input: UpdateLilBookInput!): LilBook!
    removeLilBook(lilBookId: ID!): Boolean!
  }

  input CreateLilBookInput {
    title: String!
    details: String!
    type: String!
  }

  input UpdateLilBookInput {
    lilBookId: ID!
    title: String
    details: String
    type: String
  }
`;

export default LilBookTypeDef;
