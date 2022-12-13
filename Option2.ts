import Ajv, { AnySchema } from "ajv";
import { SchemaValidator } from "./SchemaValidator";
import * as clientConfigJsonSchema from "./clientConfigSchema.json";
import { ClientConfig } from "./ClientConfig";
import hash from "object-hash";

// ==========================================
// File: CacheSchemaValidator.ts
// - setup the SchemaValidator instances on the fly
const schemaValidators: Record<string, any> = {};

export function getSchemaValidator<T>(
  rootSchema: AnySchema,
  additionalSchemas?: AnySchema[]
) {
  const hashKey = hash(rootSchema); // prevent us from creating the AJV instance for same schema

  if (!schemaValidators[hashKey]) {
    schemaValidators[hashKey] = new SchemaValidator<T>(
      rootSchema,
      additionalSchemas
    );
  }

  return schemaValidators[hashKey];
}

// ==========================================
// File: SomeProcessFile.ts
// - how we fetch the validator: pass in the "Type" and JSON schema
const payload = { a: "some random data" };
const validator = getSchemaValidator<ClientConfig>(clientConfigJsonSchema);
const output = validator.validatePayload(payload);

if (output.valid) {
  console.log("valid payload");
} else {
  console.log("invalid payload");
}
