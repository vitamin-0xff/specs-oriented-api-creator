export interface ServiceMethodSpec {
  name: string;
  repositoryOperation: string;
  transactional?: boolean;
}

export interface ServiceSpec {
  enabled: boolean;
  methods: ServiceMethodSpec[];
}
