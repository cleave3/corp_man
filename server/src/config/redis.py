import redis
from typing import Any
from . import Config
import json

JTI_EXPIRY = 3600

store = redis.Redis.from_url(url=Config.REDIS_URL)


class RedisService:

    def add_jti_to_block_list(self, jti: str) -> None:
        store.set(name=jti, value="", ex=JTI_EXPIRY)

    def token_in_blocklist(self, jti: str) -> bool:
        result = store.get(jti)

        return result is not None

    def save_json(self, key: str, value: Any):
        json_value = json.dumps(value)
        store.set(name=str(key), value=json_value)

    def get_json(self, key: str):
        result = store.get(name=str(key))

        return (
            []
            if not result
            else eval(result) if isinstance(result, bytes) else result
        )

    def remove_store_value_if_exist(self, key: str):
        value = self.get_json(str(key))

        if value:
            store.unlink(key)
