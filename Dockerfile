FROM oven/bun
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "run", "start"]
EXPOSE 3000