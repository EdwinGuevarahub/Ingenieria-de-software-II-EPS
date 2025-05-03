# Etapa 1: Construcción del proyecto
FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Ejecutar Maven para compilar el proyecto y generar el archivo .jar
RUN mvn clean package -DskipTests

# Etapa 2: Imagen de runtime
FROM amazoncorretto:17-alpine AS runtime

WORKDIR /app

# Crear usuario no root
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

# Copiar el archivo .jar generado desde la etapa de construcción
COPY --from=builder /app/target/*.jar ./app.jar

# Establece los permisos correctos
RUN chown -R nonroot:nonroot /app && \
    chmod -R 755 /app

# Cambiar a usuario no root
USER nonroot

CMD ["java", "-jar", "app.jar"]
