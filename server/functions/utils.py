def recursive_convert(o):
    """
    Recursively convert objects to plain Python types.
    If an object has a 'tolist' method, call it and recursively convert the result.
    """
    if isinstance(o, dict):
        return {k: recursive_convert(v) for k, v in o.items()}
    elif isinstance(o, (list, tuple)):
        return [recursive_convert(x) for x in o]
    elif hasattr(o, "tolist"):
        return recursive_convert(o.tolist())
    elif isinstance(o, (int, float, str)):
        return o
    else:
        try:
            return float(o)
        except Exception:
            return o
