import Ajv, { ErrorObject, ValidateFunction, AnySchema } from "ajv";
import addFormats from "ajv-formats";

// Wrapper around using AJV (prevent overhead of repeating same code to setup AJV instances)

export class SchemaValidator<T> {
  private ajv: Ajv;
  private validateFunc: ValidateFunction<T>;

  constructor(
    private readonly schema: Record<string, unknown>,
    additionalSchemas?: Array<{ schema: AnySchema; key: string }>
  ) {
    this.ajv = new Ajv({
      strict: false,
    });
    addFormats(this.ajv);

    if (additionalSchemas) {
      additionalSchemas.forEach((args) => {
        this.ajv.addSchema(args.schema, args.key);
      });
    }

    this.validateFunc = this.ajv.compile<T>(this.schema);
  }

  public validatePayload(payload: any): {
    valid: boolean;
    reason: string | null;
    errors: ErrorObject[] | null;
  } {
    const valid = this.validateFunc(payload);
    return {
      valid,
      reason: this.validateFunc.errors
        ? this.ajv.errorsText(this.validateFunc.errors)
        : this.ajv.errorsText(),
      errors: this.validateFunc.errors ? this.validateFunc.errors : null,
    };
  }
}
