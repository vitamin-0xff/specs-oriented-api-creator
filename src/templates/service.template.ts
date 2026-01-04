export function serviceTemplate(
  packageName: string,
  entityName: string,
  repositoryName: string,
  serviceName: string,
  repoVar: string,
  methods: { name: string; repositoryMethod: string; params: string, repoVar: string }[],
): string {
  const methodsStr = methods
    .map(
      (m) => `    public ${entityName} ${m.name}(${m.params}) {
        return ${repoVar}.${m.repositoryMethod}(${m.params});
    }`
    )
    .join("\n\n");

  return `package ${packageName}.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ${packageName}.domain.${entityName};
import ${packageName}.repository.${repositoryName};
import java.util.Optional;

@Service
@Transactional
public class ${serviceName} {

    private final ${repositoryName} ${repositoryName.charAt(0).toLowerCase() + repositoryName.slice(1)};

    public ${serviceName}(${repositoryName} ${repositoryName.charAt(0).toLowerCase() + repositoryName.slice(1)}) {
        this.${repositoryName.charAt(0).toLowerCase() + repositoryName.slice(1)} = ${repositoryName.charAt(0).toLowerCase() + repositoryName.slice(1)};
    }

${methodsStr}
}`;
}
