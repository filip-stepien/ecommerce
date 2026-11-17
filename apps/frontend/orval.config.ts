import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: '../../openapi/openapi.json',
        output: {
            mode: 'tags-split',
            target: 'src/api/generated',
            schemas: 'src/api/generated/model',
            client: 'react-query',
            httpClient: 'fetch',
            clean: true,
            override: {
                mutator: {
                    path: 'src/api/apiClient.ts',
                    name: 'apiClient'
                },
                fetch: {
                    includeHttpResponseReturnType: false
                }
            }
        }
    },
    apiZod: {
        input: '../../openapi/openapi.json',
        output: {
            mode: 'tags-split',
            target: 'src/api/zod',
            schemas: {
                path: 'src/api/zod/model',
                type: 'zod'
            },
            client: 'zod',
            fileExtension: '.zod.ts',
            clean: true
        }
    }
});
