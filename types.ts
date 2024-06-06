export interface GraphQLEventLogs {
  logs: {
    data: string | null,
      topic0: string | null,
      topic1: string | null,
      topic2: string | null,
      topic3: string | null,
  }[],
}

export interface FormattedLog {
  topics: string[],
  data: string,
  address: string,
}
