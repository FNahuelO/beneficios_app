import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
}

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  const response = http.post(
    `${baseUrl}/api/credencial/consultar`,
    JSON.stringify({
      documento: '12345678',
      email: 'test@example.com',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  check(response, {
    'status valido': (r) => [200, 404].includes(r.status),
  })

  sleep(1)
}
