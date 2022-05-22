import azure.functions as func

import fastapi

app = fastapi.FastAPI()


@app.get("/hello/{name}")
def get_name(
    name: str,
):
    return name(name)


def name(name):
    return {
        "name": name,
    }


def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)
