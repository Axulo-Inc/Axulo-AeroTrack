import pandas as pd

def load_aircraft():
    return pd.read_csv("data/aircraft.csv")

def calculate_next_inspection(df, interval=100):
    df["next_inspection_at_hours"] = df["flight_hours"] + interval
    return df

if __name__ == "__main__":
    aircraft = load_aircraft()
    aircraft = calculate_next_inspection(aircraft)
    print(aircraft)
