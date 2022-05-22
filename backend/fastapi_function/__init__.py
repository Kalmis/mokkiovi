import azure.functions as func

import fastapi

app = fastapi.FastAPI()


def get_name(name):
    return {
        "name": name,
    }


@app.get("/hello/{name}")
def hello(
    name: str,
):
    return get_name(name)




def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)
