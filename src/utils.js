import { types } from "mobx-state-tree"
import * as JsonApi from './models/JsonApi';

/**
 * Iterate trough object keys
 *
 * @param {object} obj - Object that needs to be iterated
 * @param {Function} fn - Function that should be called for every iteration
 */
export function objectForEach(obj, fn) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(key);
    }
  }
}

/**
 * Iterate trough one item or array of items and call the defined function
 *
 * @export
 * @template T
 * @param {(object|Array<object>)} data - Data which needs to be iterated
 * @param {Function} fn - Function that needs to be callse
 * @returns {(T|Array<T>)} - The result of iteration
 */
export function mapItems(data, fn) {
  return data instanceof Array ? data.map((item) => fn(item)) : fn(data);
}

/**
 * Flatten the JSON API record so it can be inserted into the model
 *
 * @export
 * @param {JsonApiRecord} record - original JSON API record
 * @returns {object} - Flattened object
 */
export function flattenRecord(record) {
  const data = {
    __internal: {},
    id: record.id,
    type: record.type,
  };

  objectForEach(record.attributes, (key) => {
    data[key] = record.attributes[key];
  });

  objectForEach(record.relationships, (key) => {
    const rel: JsonApi.Relationship = record.relationships[key];

    if (rel.meta) {
      data[`${key}Meta`] = rel.meta;
    }

    if (rel.links) {
      data.__internal.relationships = data.__internal.relationships || {};
      data.__internal.relationships[key] = rel.links;
    }
  });

  objectForEach(record.links, (key) => {
    if (record.links[key]) {
      data.__internal.links = data.__internal.links || {};
      data.__internal.links[key] = record.links[key];
    }
  });

  objectForEach(record.meta, (key) => {
    if (record.meta[key]) {
      data.__internal.meta = data.__internal.meta || {};
      data.__internal.meta[key] = record.meta[key];
    }
  });

  return data;
}

export const isBrowser: boolean = (typeof window !== 'undefined');

/**
 * Assign objects to the target object
 * Not a complete implementation (Object.assign)
 * Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign polyfill
 *
 * @private
 * @param {object} target - Target object
 * @param {Array<object>} args - Objects to be assigned
 * @returns
 */
export function assign(target, ...args) {
  args.forEach((nextSource) => {
    if (nextSource != null) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          target[nextKey] = nextSource[nextKey];
        }
      }
    }
  });
  return target;
}

/**
 * Returns the value if it's not a function. If it's a function
 * it calls it.
 *
 * @export
 * @template T
 * @param {(T|(() => T))} target can be  anything or function
 * @returns {T} value
 */
export function getValue(target) {
  if (typeof target === 'function') {
    return target();
  }

  return target;
}
