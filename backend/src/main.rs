use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

// --- データモデルの定義 ---

#[derive(Debug, Clone, Serialize, Deserialize)]
struct UserProfile {
    id: String, // ユーザーを識別するための一意のID
    prefecture: String,
    age: String,
    gender: String,
    headacheFrequency: String,
    pressureSensitivity: i32,
    #[serde(rename = "commonSymptoms")]
    common_symptoms: Vec<String>,
    triggers: Vec<String>,
    notifications: bool,
}

#[derive(Debug, Serialize)]
struct MatchedUser {
    user: UserProfile,
    score: i32,
}

// 複数のスレッドから安全にアクセスするためのデータベース（の代わり）
type Db = Arc<RwLock<Vec<UserProfile>>>;

// --- APIハンドラの定義 ---

#[tokio::main]
async fn main() {
    // インメモリデータベースを初期化
    let db: Db = Arc::new(RwLock::new(Vec::new()));

    // アプリケーションのルーターを定義
    let app = Router::new()
        .route("/", get(root))
        .route("/users", post(create_user))
        .route("/matches/:user_id", get(get_matches))
        .with_state(db); // すべてのハンドラでDBを共有

    // サーバーを起動
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Headache Tracker API (Rust version) is running!"
}

// ユーザーを登録するハンドラ
async fn create_user(
    State(db): State<Db>,
    Json(user): Json<UserProfile>,
) -> Json<UserProfile> {
    let mut db_lock = db.write().await;
    db_lock.push(user.clone());
    println!("User registered: {}", user.id);
    Json(user)
}

// 特定のユーザーに似たユーザーを検索するハンドラ
async fn get_matches(
    State(db): State<Db>,
    Path(user_id): Path<String>,
) -> Result<Json<Vec<MatchedUser>>, StatusCode> {
    let db_lock = db.read().await;

    let current_user = db_lock.iter().find(|u| u.id == user_id);

    if current_user.is_none() {
        return Err(StatusCode::NOT_FOUND);
    }
    let current_user = current_user.unwrap();

    let mut ranked_users = Vec::new();

    for other_user in db_lock.iter() {
        if other_user.id == current_user.id {
            continue; // 自分自身とは比較しない
        }

        let mut score = 0;
        // 共通の症状
        for symptom in &current_user.common_symptoms {
            if other_user.common_symptoms.contains(symptom) {
                score += 10;
            }
        }
        // 共通のトリガー
        for trigger in &current_user.triggers {
            if other_user.triggers.contains(trigger) {
                score += 8;
            }
        }
        // 気圧の敏感度の近さ
        let sensitivity_diff = (current_user.pressureSensitivity - other_user.pressureSensitivity).abs();
        score += (5 - sensitivity_diff) * 5;

        if score > 0 {
            ranked_users.push(MatchedUser {
                user: other_user.clone(),
                score,
            });
        }
    }

    // スコアの高い順にソート
    ranked_users.sort_by(|a, b| b.score.cmp(&a.score));

    // 上位10件を返す
    ranked_users.truncate(10);
    
    Ok(Json(ranked_users))
}
