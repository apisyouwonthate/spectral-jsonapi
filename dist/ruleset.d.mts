import * as _stoplight_spectral_functions from '@stoplight/spectral-functions';
import * as _stoplight_spectral_core from '@stoplight/spectral-core';
import { DiagnosticSeverity } from '@stoplight/types';

declare const _default: {
    description: string;
    formats: _stoplight_spectral_core.Format[];
    aliases: {
        AllContentSchemas: string[];
        ResourceObjects: string[];
        POSTResourceObjects: string[];
        LinkObjects: string[];
        MetaObjects: string[];
        Relationships: string[];
        RelationshipData: string[];
        POSTRelationships: string[];
        PATCHRelationships: string[];
        ErrorObjects: string[];
    };
    rules: {
        "content-type": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string[];
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string, _stoplight_spectral_functions.PatternOptions>;
                functionOptions: {
                    match: string;
                };
            };
        };
        "406-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "415-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "top-level-json-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "top-level-json-properties": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    schema: {
                        type: string;
                        anyOf: {
                            required: string[];
                        }[];
                        not: {
                            anyOf: {
                                required: string[];
                            }[];
                        };
                        dependentRequired: {
                            included: string[];
                        };
                        properties: {
                            data: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            errors: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            meta: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            jsonapi: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            links: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            included: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "resource-object-properties": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string[];
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            })[];
        };
        "resource-object-id-required": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "resource-object-property-types": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string[];
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "resource-object-reserved-fields": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            }[];
        };
        "attributes-object-type": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "attributes-object-properties": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            }[];
        };
        "attributes-object-foreign-keys": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string, _stoplight_spectral_functions.PatternOptions>;
                functionOptions: {
                    notMatch: string;
                };
            };
        };
        "relationships-object-type": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "relationship-schema": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                    dialect?: undefined;
                    schema?: undefined;
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        anyOf: {
                            required: string[];
                        }[];
                        properties: {
                            links: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    properties: {
                                        type: string;
                                        anyOf: {
                                            required: string[];
                                        }[];
                                        properties: {
                                            self: {
                                                type: string;
                                            };
                                            related: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                            data: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            meta: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                        additionalProperties: boolean;
                    };
                    values?: undefined;
                };
            })[];
        };
        "relationship-data-properties": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string[];
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "relationship-data-schema": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string[];
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        required: string[];
                        properties: {
                            id: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            type: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            meta: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        "meta-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "links-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "links-object-schema": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            };
        };
        "links-object-schema-properties": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            })[];
        };
        "jsonapi-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            })[];
        };
        "fetching-resource-200": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "fetching-resource-404": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "400-response-code": {
            description: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "include-parameter": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                    dialect?: undefined;
                    schema?: undefined;
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        properties: {
                            type: {
                                type: string;
                                enum: string[];
                            };
                            items: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                    values?: undefined;
                };
            })[];
        };
        "fields-parameter": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                    dialect?: undefined;
                    schema?: undefined;
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        properties: {
                            type: {
                                type: string;
                                enum: string[];
                            };
                        };
                    };
                    values?: undefined;
                };
            })[];
        };
        "sort-parameter": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                    dialect?: undefined;
                    schema?: undefined;
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        properties: {
                            type: {
                                type: string;
                                enum: string[];
                            };
                            items: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                    values?: undefined;
                };
            })[];
        };
        "page-parameter": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: ({
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                    dialect?: undefined;
                    schema?: undefined;
                };
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
                functionOptions?: undefined;
            } | {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        properties: {
                            type: {
                                type: string;
                                enum: string[];
                            };
                            properties: {
                                type: string;
                                additionalProperties: boolean;
                                properties: {
                                    cursor: {
                                        type: string;
                                        properties: {
                                            type: {
                                                type: string;
                                                enum: string[];
                                            };
                                        };
                                    };
                                    offset: {
                                        type: string;
                                        properties: {
                                            type: {
                                                type: string;
                                                enum: string[];
                                            };
                                            format: {
                                                type: string;
                                                enum: string[];
                                            };
                                            minimum: {
                                                type: string;
                                                minimum: number;
                                            };
                                        };
                                    };
                                    limit: {
                                        type: string;
                                        properties: {
                                            type: {
                                                type: string;
                                                enum: string[];
                                            };
                                            format: {
                                                type: string;
                                                enum: string[];
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    values?: undefined;
                };
            })[];
        };
        "post-requests-single-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "post-relationships": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    schema: {
                        type: string;
                        items: {
                            type: string;
                            anyOf: {
                                enum: string[];
                            }[];
                        };
                    };
                };
            };
        };
        "403-response-code": {
            description: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "201-response-location-header": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "post-201-response": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    schema: {
                        type: string;
                        items: {
                            type: string;
                            anyOf: {
                                enum: string[];
                            }[];
                        };
                    };
                };
            };
        };
        "post-2xx-response-codes": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        anyOf: {
                            required: string[];
                        }[];
                    };
                };
            };
        };
        "post-409-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "post-409-response": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "put-disallowed": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            }[];
        };
        "patch-requests-single-object": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "patch-relationships": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    schema: {
                        type: string;
                        items: {
                            type: string;
                            anyOf: {
                                enum: string[];
                            }[];
                        };
                    };
                };
            };
        };
        "patch-2xx-response-codes": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        anyOf: {
                            required: string[];
                        }[];
                    };
                };
            };
        };
        "patch-404-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "patch-409-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "patch-409-response": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "delete-2xx-response-codes": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        anyOf: {
                            required: string[];
                        }[];
                    };
                };
            };
        };
        "delete-404-response-code": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            };
        };
        "error-object-schema": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<string | number | boolean | null, _stoplight_spectral_functions.EnumerationOptions>;
                functionOptions: {
                    values: string[];
                };
            }[];
        };
        "error-object-links": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, null>;
            }[];
        };
        "error-object-source-schema": {
            description: string;
            documentationUrl: string;
            message: string;
            severity: DiagnosticSeverity;
            given: string;
            then: {
                field: string;
                function: _stoplight_spectral_core.RulesetFunctionWithValidator<unknown, _stoplight_spectral_functions.SchemaOptions>;
                functionOptions: {
                    dialect: string;
                    schema: {
                        type: string;
                        properties: {
                            parameter: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                            pointer: {
                                type: string;
                                properties: {
                                    oneOf: {
                                        type: string;
                                        items: {
                                            oneOf: ({
                                                type: string;
                                                required: string[];
                                                properties: {
                                                    type: {
                                                        type: string;
                                                        enum: string[];
                                                    };
                                                    format: {
                                                        type: string;
                                                        enum: string[];
                                                    };
                                                    items?: undefined;
                                                };
                                            } | {
                                                type: string;
                                                properties: {
                                                    type: {
                                                        type: string;
                                                        enum: string[];
                                                    };
                                                    items: {
                                                        type: string;
                                                        required: string[];
                                                        properties: {
                                                            type: {
                                                                type: string;
                                                                enum: string[];
                                                            };
                                                            format: {
                                                                type: string;
                                                                enum: string[];
                                                            };
                                                        };
                                                    };
                                                    format?: undefined;
                                                };
                                                required?: undefined;
                                            })[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
};

export { _default as default };
