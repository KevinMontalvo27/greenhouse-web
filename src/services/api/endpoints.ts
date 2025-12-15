const ENDPOINTS = {
    // Autenticación
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users',
    },

    // Usuarios
    USERS: {
        BASE: '/users',
        BY_ID: (id: number) => `/users/${id}`,
        ALL: '/users',
    },

    // Invernaderos
    GREENHOUSES: {
        BASE: '/greenhouses',
        BY_ID: (id: number) => `/greenhouses/${id}`,
        BY_USER: (userId: number) => `/greenhouses/user/${userId}`,
    },

    // Plantas
    PLANTS: {
        BASE: '/plants',
        BY_ID: (id: number) => `/plants/${id}`,
        BY_GREENHOUSE: (greenhouseId: number) => `/plants/greenhouse/${greenhouseId}`,
        BY_TYPE: (type: string) => `/plants/type/${type}`,
        SEARCH: '/plants/search',
        COUNT: (greenhouseId: number) => `/plants/greenhouse/${greenhouseId}/count`,
        DELETE_ALL: (greenhouseId: number) => `/plants/greenhouse/${greenhouseId}/all`,
    },

    // Sensores
    SENSORS: {
        BASE: '/sensors',
        BY_ID: (id: number) => `/sensors/${id}`,
        BY_GREENHOUSE: (greenhouseId: number) => `/sensors/greenhouse/${greenhouseId}`,
    },

    // Lecturas de sensores
    SENSOR_READINGS: {
        BASE: '/sensor-readings',
        BY_SENSOR: (sensorId: number) => `/sensor-readings/sensor/${sensorId}`,
        LATEST: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/latest`,
        STATISTICS: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/statistics`,
        LAST_HOURS: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/last-hours`,
        LAST_DAYS: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/last-days`,
        HOURLY_AVERAGES: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/hourly-averages`,
        DAILY_AVERAGES: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/daily-averages`,
        COUNT: (sensorId: number) => `/sensor-readings/sensor/${sensorId}/count`,
        BULK: '/sensor-readings/bulk',
    },
} as const;

export default ENDPOINTS;




