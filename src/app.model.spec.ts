import { ApiPayloadSchema } from './app.model';

const getValidationErrorsForProp = (prop, obj) => {
  const validation = ApiPayloadSchema.validate(obj, {
    abortEarly: false,
    allowUnknown: false,
    convert: false,
  });
  const errors = validation.error.details;
  return errors.filter((e) => {
    const propPath = e.path.join('.');
    return propPath === prop;
  });
};

const expectNoValidationError = (prop, obj) => {
  const errors = getValidationErrorsForProp(prop, obj);
  if (errors.length > 0) {
    fail(
      `Found unexpected validation errors for property [${prop}] when validating object ${JSON.stringify(
        obj,
      )}. Found the following errors: [${errors.map((e) => e.type)}]`,
    );
  }
};

const expectValidationError = (expectedErrType, prop, obj) => {
  const errors = getValidationErrorsForProp(prop, obj);
  const errFound = errors.some((e) => e.type === expectedErrType);
  if (!errFound) {
    fail(
      `Could not find validation error [${expectedErrType}] for property [${prop}] when validating object ${JSON.stringify(
        obj,
      )}. Found the following errors: [${errors.map((e) => e.type)}]`,
    );
  }
};

describe('ApiPayload', () => {
  describe('when contains unexpected field', () => {
    it('should fail validation', () => {
      expectValidationError('object.unknown', 'aaa', {
        aaa: 123,
      });
    });
  });

  describe('ts property', () => {
    it('should be required', () => {
      expectValidationError('any.required', 'ts', {});
    });

    it('should be a string', () => {
      expectValidationError('string.base', 'ts', {
        ts: 123,
      });
      expectValidationError('string.base', 'ts', {
        ts: -123,
      });
      expectValidationError('string.base', 'ts', {
        ts: {},
      });
    });

    it('should be a unix timestamp', () => {
      expectValidationError('timestamp.unix', 'ts', {
        ts: 'ABC',
      });
      expectValidationError('timestamp.unix', 'ts', {
        ts: '-123',
      });
      expectNoValidationError('ts', { ts: '123' });
    });
  });

  describe('sender property', () => {
    it('should be required', () => {
      expectValidationError('any.required', 'sender', {});
    });

    it('should be a string', () => {
      expectValidationError('string.base', 'sender', {
        sender: 123,
      });
      expectValidationError('string.base', 'sender', {
        sender: -123,
      });
      expectValidationError('string.base', 'sender', {
        sender: {},
      });
    });
  });

  describe('sent-from-ip property', () => {
    it('should not be required', () => {
      expectNoValidationError('sent-from-ip', {});
    });

    it('should be a ipv4 string', () => {
      expectValidationError('string.base', 'sent-from-ip', {
        'sent-from-ip': 123,
      });
      expectValidationError('string.base', 'sent-from-ip', {
        'sent-from-ip': -123,
      });

      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '111',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '111.111',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '111.111.111',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '111.111.111.111.111',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '256.0.0.0',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '0.256.0.0',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '0.0.256.0',
      });
      expectValidationError('ip.v4', 'sent-from-ip', {
        'sent-from-ip': '0.0.0.256',
      });

      expectNoValidationError('sent-from-ip', { 'sent-from-ip': '0.0.0.0' });
      expectNoValidationError('sent-from-ip', { 'sent-from-ip': '1.255.0.1' });
      expectNoValidationError('sent-from-ip', {
        'sent-from-ip': '255.255.255.255',
      });
    });
  });

  describe('message property', () => {
    it('should contains at least one field', () => {
      expectValidationError('object.not-empty', 'message', {
        message: {},
      });
      expectNoValidationError('message', {
        message: {
          foo: 'foo',
        },
      });
      expectNoValidationError('message', {
        message: {
          bar: 'bar',
        },
      });
      expectNoValidationError('message', {
        message: {
          foo: 'foo',
          bar: 'bar',
        },
      });
      expectNoValidationError('message', {
        message: {
          foo: {
            bar: 'bar',
          },
        },
      });
    });
  });
});
