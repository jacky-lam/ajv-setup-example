import Ajv, { ErrorObject, ValidateFunction, AnySchema } from "ajv";
import addFormats from "ajv-formats";
import * as clientConfigJsonSchema from "./clientConfigSchema.json";
import { ClientConfig } from "./ClientConfig";
import hash from "object-hash";

// ==========================================
// File: CacheSchemaValidator.ts
// - setup the SchemaValidator instances on the fly
const schemaValidators: Record<string, any> = {};

class SchemaValidator {
  
  function getSchemaValidator<T>(
    rootSchema: AnySchema,
    additionalSchemas?: AnySchema[]
  ) {
    const hashKey = hash(rootSchema); // prevent us from creating the AJV instance for same schema

    if (!schemaValidators[hashKey]) {
      const validator = {
        ajv = new Ajv({
          strict: false,
        });
      }

      addFormats(validator.ajv);

      if (additionalSchemas) {
        additionalSchemas.forEach((args) => {
          validator.ajv.addSchema(args.schema, args.key);
        });
      }

      validator.validateFunc = validator.ajv.compile<T>(rootSchema);
      
      schemaValidators[hashKey] = validator;
    }

    return schemaValidators[hashKey];
  }
  
  public validatePayload<T>(
    payload: T,
    rootSchema: AnySchema,
    additionalSchemas?: AnySchema[]
  ): {
    valid: boolean;
    reason: string | null;
    errors: ErrorObject[] | null;
  } {
    const validator = getSchemaValidator(rootSchema,additionalSchemas);
    const valid = validator.validateFunc(payload);
    return {
      valid,
      reason: validator.validateFunc.errors
        ? validator.ajv.errorsText(validator.validateFunc.errors)
        : validator.ajv.errorsText(),
      errors: validator.validateFunc.errors ? validator.validateFunc.errors : null,
    };
  }
}


// ==========================================
// File: SomeProcessFile.ts
// - how we fetch the validator: pass in the "Type" and JSON schema
const payload = { a: "some random data" };
const output = SchemaValidator.validate<ClientConfig>(payload, clientConfigJsonSchema);

if (output.valid) {
  console.log("valid payload");
} else {
  console.log("invalid payload");
}
