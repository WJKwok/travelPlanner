require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

//const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const url = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5010;

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res }),
});

mongoose
	.connect(url, { useNewUrlParser: true })
	.then(() => {
		console.log('connected to MongoDB');
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`server running at ${res.url}`);
	})
	.catch((err) => {
		console.error(err);
	});
