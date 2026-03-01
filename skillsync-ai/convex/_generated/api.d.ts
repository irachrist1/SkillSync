/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analysis from "../analysis.js";
import type * as analysisRunner from "../analysisRunner.js";
import type * as data from "../data.js";
import type * as jobs from "../jobs.js";
import type * as lib_aiParser from "../lib/aiParser.js";
import type * as lib_analysis from "../lib/analysis.js";
import type * as profiles from "../profiles.js";
import type * as progress from "../progress.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analysis: typeof analysis;
  analysisRunner: typeof analysisRunner;
  data: typeof data;
  jobs: typeof jobs;
  "lib/aiParser": typeof lib_aiParser;
  "lib/analysis": typeof lib_analysis;
  profiles: typeof profiles;
  progress: typeof progress;
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
