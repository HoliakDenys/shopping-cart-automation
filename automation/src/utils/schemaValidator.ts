import AjvModule from 'ajv';
import addFormatsModule from 'ajv-formats';

const Ajv = AjvModule.default || AjvModule;
const addFormats = addFormatsModule.default || addFormatsModule;

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  useDefaults: true,
});

addFormats(ajv);

export function validateSchema<T>(data: unknown, schema: object): T {
  const validate = ajv.compile<T>(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = ajv.errorsText(validate.errors, { separator: '\n' });
    throw new Error(`JSON Schema validation failed:\n${errors}`);
  }

  return data as T;
}
