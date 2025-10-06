import * as yup from "yup";

type Type = "http" | "heartbeat";

export const checkSchema = yup.object({
  type: yup.mixed<Type>().oneOf(["http", "heartbeat"] as const).required("Type is required"),
  name: yup.string().required("Name Required"),

  intervalSec: yup
    .number().typeError("Interval must be a number")
    .integer("Interval must be an integer")
    .positive("Interval must be > 0")
    .required("Interval Required"),

  timeoutMs: yup
    .number().typeError("Timeout must be a number")
    .integer("Timeout must be an integer")
    .positive("Timeout must be > 0")
    .required("Time Out Required"),

  // http -> required, heartbeat -> strip (hilang dari hasil validate)
  target: yup.string().trim().url().when("type", {
    is: "http",
    then: (s) => s.required("Target is Required"),
    otherwise: (s) => s.strip(),
  }),

  // http -> required (+ validasi), heartbeat -> strip
  successCodes: yup
    .mixed<string | number[]>() // UI kirim "200,201"
    .transform((val, orig) => {
      if (Array.isArray(orig)) return orig;
      if (typeof orig === "string") {
        const nums = orig
          .split(/[,\s]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => Number(s))
          .filter((n) => Number.isFinite(n));
        return nums;
      }
      return val;
    })
    .test("is-array", "Success codes must be a comma-separated list of numbers",
      (v) => v === undefined || Array.isArray(v)
    )
    .test("range", "Each code must be 100–599",
      (v) => v === undefined || (Array.isArray(v) && v.every((n) => Number.isInteger(n) && n >= 100 && n <= 599))
    )
    .when("type", {
      is: "http",
      then: (s) =>
        s
          .test("min-one", "At least one success code", (v) => Array.isArray(v) && v.length > 0)
          .required("Success Code is Required"),
      otherwise: (s) => s.strip(),
    }),
});


export type CheckFormValues = yup.InferType<typeof checkSchema>;
