/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as builders from "../builders.js";
import type * as crons from "../crons.js";
import type * as founders from "../founders.js";
import type * as github from "../github.js";
import type * as labLeads from "../labLeads.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_githubIdentity from "../lib/githubIdentity.js";
import type * as members from "../members.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  builders: typeof builders;
  crons: typeof crons;
  founders: typeof founders;
  github: typeof github;
  labLeads: typeof labLeads;
  "lib/auth": typeof lib_auth;
  "lib/githubIdentity": typeof lib_githubIdentity;
  members: typeof members;
  projects: typeof projects;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
