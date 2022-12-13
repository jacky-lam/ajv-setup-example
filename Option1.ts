import { SchemaValidator } from "./SchemaValidator";
import * as clientConfigJsonSchema from "./clientConfigSchema.json";
import { ClientConfig } from "./ClientConfig";

// ==========================================
// File: SetupSchemaValidator.ts
// - setup all the SchemaValidator instances at the start
export enum SchemaKey {
  ClientConfig = "ClientConfig",
}
export type SchemaType = {
  [SchemaKey.ClientConfig]: ClientConfig;
};

export const schemaValidators = {
  [SchemaKey.ClientConfig]: new SchemaValidator<
    SchemaType[SchemaKey.ClientConfig]
  >(clientConfigJsonSchema),
};

// ==========================================
// File: SomeProcessFile.ts
// - how we fetch the validator: pass in the "key"
const payload = { a: "some random data" };
const validator = schemaValidators[SchemaKey.ClientConfig];
const output = validator.validatePayload(payload);

if (output.valid) {
  console.log("valid payload");
} else {
  console.log("invalid payload");
}
