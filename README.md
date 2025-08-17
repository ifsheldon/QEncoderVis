# Environment buiding


### React-app building
1. enter the frontend forder
2. run `npm install` for installing all required packages

### Backend building
Use `uv` and just run `uv sync`.

### Launch the application
1. run `npm start` to launch the frontend React app
2. run `python app.py` to launch the backend Flask app

### API
Single endpoint for running circuits:

POST `/api/run_circuit`

Body:

```
{ "circuit": 0 }
```

Allowed circuit ids: 0, 1, 2, 3, 4, 5.

Example:

```bash
curl -X POST http://127.0.0.1:3030/api/run_circuit \
  -H 'Content-Type: application/json' \
  -d '{"circuit": 5}'
```

## TODOs
* Implement training progress
* Fix all buttons
* Implement edge detection
* Add different descriptions for different encodings