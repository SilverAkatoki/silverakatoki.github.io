declare global {
  type Option<T> = T | null | undefined;
  type Nullable<T> = T | null;
  type Maybe<T> = T | undefined;
}

export default {};
