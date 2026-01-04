export interface SecurityRuleSpec {
  target: "controller" | "endpoint";
  name: string;
  roles: string[];
}

export interface SecuritySpec {
  defaultRoles?: string[];
  rules?: SecurityRuleSpec[];
}
