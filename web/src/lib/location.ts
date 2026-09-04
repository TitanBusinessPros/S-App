export interface GetLocationNameResult {
  /** The nearest town/city, e.g. "Norman, Oklahoma" — null if none could be resolved. */
  locality: string | null
  attribution: string
}
