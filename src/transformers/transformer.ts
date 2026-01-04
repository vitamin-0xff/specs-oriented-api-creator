export interface Transformer<Input, Output> {
  transform(input: Input): Output;
}
