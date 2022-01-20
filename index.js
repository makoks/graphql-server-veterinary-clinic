const { ApolloServer, gql } = require('apollo-server');

let animals = require('./lib/animals');
const owners = require('./lib/owners');
const animalController = require('./lib/animalController');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Animal {
    id: ID!
    name: String!
    kind: String
    age: Int
    gender: Gender
    caseRecord: String
    owner: Owner!
  }

  type Owner {
    id: ID!
    name: String!
    phone: String!
    email: String
    address: String
    pets: [Animal]
  }

  enum Gender {
    Male
    Female
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    animals: [Animal]
    owners: [Owner]
    animal(id: ID!): Animal
  }

  type Mutation {
    updateAnimal(
      id: ID,
      name: String,
      kind: String,
      age: Int,
      gender: Gender,
      caseRecord: String,
      ownerId: ID,
    ): MutationResponse,
    deleteAnimal(id: ID!): MutationResponse,
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    animals: () => animals,
    owners: () => owners,
    animal: (_, args) => animals.find(({ id }) => id === args.id),
  },
  Mutation: {
    updateAnimal: (_, args) => animalController.update(args, animals),
    deleteAnimal: (_, { id }) => animalController.delete(id, animals),
  },
  Animal: {
    owner: animal => owners.find(({ id }) => id === animal.ownerId),
  },
  Owner: {
    pets: owner => animals.filter(({ ownerId }) => ownerId === owner.id),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
