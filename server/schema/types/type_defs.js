const gql = require('graphql-tag')

const TypeDefs = gql`
  type User {
    _id: ID!
    blogName: String!
    email: String!
    password: String!
    token: String!
    loggedIn: Boolean!
    created: Int!
    lastUpdated: Int!
  }

  input NewUserInput {
    blogName: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type AuthData {
    token: String!
    loggedIn: Boolean!
  }

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    registerUser(NewUserInput: NewUserInput): AuthData
    loginUser(LoginUserInput: LoginUserInput): AuthData
    logoutUser(token: String!): AuthData
    verifyUser(token: String!): AuthData
  }
`;

module.exports = TypeDefs;