from fastapi import FastAPI, HTTPException, Body, Depends
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# CORSを回避するために追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 許可するHTTPメソッド
    allow_headers=["*"],  # 許可するヘッダー
)

class ProductQuery(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/search_product/")
def search_product(product_query: ProductQuery = Body(...)):
    # 商品コードを使ってデータベースから商品情報を取得する
    database_path = 'C:\Users\ryana\Step4-main\Step4-main\FastAPI\app\sample.db'
    conn = sqlite3.connect(database_path)
    c = conn.cursor()
    c.execute('SELECT * FROM products WHERE CODE=?', (product_query.code,))
    result = c.fetchone()
    conn.close()

    if result:
        # 検索結果があれば商品情報を返す
        product = {
            "PRD_ID": result[0],
            "CODE": result[1],  # テーブルのカラム名をCODEに修正
            "NAME": result[2],   # テーブルのカラム名をNAMEに修正
            "PRICE": result[3]   # テーブルのカラム名をPRICEに修正
        }
        return {"status": "success", "message": product}
    else:
        # 検索結果がない場合はエラーメッセージを返す
        return {"status": "failed", "message": "商品が見つかりませんでした。"}
