import joblib

pipeline = joblib.load('backend/fraud_detection_pipeline.pkl')
if hasattr(pipeline, 'feature_names_in_'):
    print("Features expected by pipeline:")
    print(list(pipeline.feature_names_in_))
else:
    print("Pipeline doesn't have feature_names_in_ attribute. Try looking at the first step.")
    try:
        first_step = pipeline.steps[0][1]
        if hasattr(first_step, 'feature_names_in_'):
            print(list(first_step.feature_names_in_))
    except:
        pass
