import { types } from "mobx-state-tree"

const Identifier = types.model({
	id: types.optional(types.union(types.string, types.number), ''),
	type: types.string
});

const JsonApiObject = types.model({
	version: types.optional(types.string, ''),
	meta: types.optional(types.map(types.frozen), {})
});

const Link = types.union(types.string, types.model({
  href: types.string,
  meta: types.map(types.frozen)
}));

const Error = types.model({
	id: types.optional(types.union(types.string, types.number), ''),
	links: types.maybe(types.model({
		about: Link
	})),
	status: types.optional(types.number, 0),
	code: types.optional(types.string, ''),
	title: types.optional(types.string, ''),
	details: types.optional(types.string, ''),
	source: types.optional(types.model({
		pointer: types.optional(types.string, ''),
		parameter: types.optional(types.string, '')
	}), {}),
	meta: types.optional(types.map(types.frozen), {})
});

const Relationship = types.model({
	data: types.maybe(types.union(Identifier, types.array(Identifier))),
	links: types.maybe(types.map(Link)),
	meta: types.optional(types.map(types.frozen), {})
});

const Record = types.model({
	id: types.optional(types.union(types.string, types.number), ''),
	type: types.string,
	attributes: types.map(types.frozen),
	relationships: types.optional(types.map(Relationship), {}),
	links: types.optional(types.map(Link), {}),
	meta: types.optional(types.map(types.frozen), {})
});

const Respond = types.model({
	data: types.maybe(types.union(Record, types.array(Record))),
	errors: types.maybe(types.array(Error)),

	included: types.maybe(types.array(Record)),

	meta: types.optional(types.map(types.frozen), {}),
	links: types.maybe(types.map(Link)),
	jsonapi: types.maybe(JsonApiObject)
});

const Request = Respond; // Not sure if this is correct, but it's ok for now

export {
	Identifier,
	JsonApiObject,
	Link,
	Error,
	Relationship,
	Record,
	Respond,
	Request
};