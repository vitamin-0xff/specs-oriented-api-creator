export function repositoryTemplate(
  packageName: string,
  entityName: string,
  repositoryName: string,
  customMethods: string[],
): string {
  const methodsStr = customMethods.join("\n    ");

  return `package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ${packageName}.domain.${entityName};

@Repository
public interface ${repositoryName} extends JpaRepository<${entityName}, Long> {

    ${methodsStr}
}`;
}
