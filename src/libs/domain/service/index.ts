export interface ApplicationService<Input, Output> {
  execute(input: Input): Output;
}
