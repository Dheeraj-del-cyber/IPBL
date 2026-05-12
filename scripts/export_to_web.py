import os

def convert_model():
    print("--- Preparing TensorFlow.js Conversion ---")
    
    # 1. Install tensorflowjs if not present
    try:
        import tensorflowjs as tfjs
    except ImportError:
        print("Installing tensorflowjs tool...")
        os.system('pip install tensorflowjs')
        import tensorflowjs as tfjs

    # 2. Check if model.h5 exists
    if not os.path.exists('model.h5'):
        print("Error: model.h5 not found. Wait for training to finish!")
        return

    # 3. Create output directory in the PWA folder
    output_path = '../end/public/models/disease_model'
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    # 4. Convert
    print(f"Converting model.h5 to {output_path}...")
    os.system(f'tensorflowjs_converter --input_format=keras model.h5 {output_path}')
    
    print("\nSUCCESS! Your high-accuracy model is now ready for offline use in the PWA.")
    print(f"Files created in: {output_path}")

if __name__ == "__main__":
    convert_model()
