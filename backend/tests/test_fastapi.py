from fastapi_function import name

import pytest


class TestFastAPI:
    def test_main(self):
        """Dummy test so release / PR actions can be setup"""
        name("test")
