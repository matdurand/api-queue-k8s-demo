import * as Joi from 'joi';

function isValidIpV4(ipaddress) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress,
  );
}

export const ApiPayloadSchema = Joi.object({
  ts: Joi.string()
    .required()
    .custom((value, helpers) => {
      const positiveIntRegex = /^[0-9]+$/;
      if (value.match(positiveIntRegex)) {
        return value;
      }
      return helpers.error('timestamp.unix');
    }, 'unix-timestamp'),

  sender: Joi.string().required(),

  message: Joi.object()
    .required()
    .custom((value, helpers) => {
      if (value && Object.keys(value).length > 0) {
        return value;
      }
      return helpers.error('object.not-empty');
    }, 'object.not-empty'),

  'sent-from-ip': Joi.string().custom((value, helpers) => {
    if (isValidIpV4(value)) {
      return value;
    }
    return helpers.error('ip.v4');
  }, 'ip.v4'),

  priority: Joi.number(),
});
