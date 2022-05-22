from fastapi_function import get_name

import pytest


class TestFastAPI:
    def test_main(self):
        """Dummy test so release / PR actions can be setup"""
        get_name("test")
