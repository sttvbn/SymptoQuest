# checker/symptom_checker.py
import json

class SymptomChecker:
    def __init__(self):
        with open('symptom.json') as f:
            data = json.load(f)
            self.symptoms = {symptom['name']: symptom['questions'] for symptom in data['symptoms']}

        self.diagnoses = {
            ('fever', 'cough'): 'You may have a cold.',
            # Add more diagnoses based on symptom combinations
        }

    def get_next_question(self, symptoms):
        for symptom, question in self.symptoms.items():
            if symptom not in symptoms:
                return question

    def diagnose(self, symptoms):
        for symptom_combination, diagnosis in self.diagnoses.items():
            if set(symptom_combination).issubset(symptoms):
                return diagnosis
        return "No diagnosis found."

# Example usage
if __name__ == "__main__":
    checker = SymptomChecker()
    symptoms = []

    while True:
        next_question = checker.get_next_question(symptoms)
        user_response = input(next_question + ' (yes/no): ').lower().strip()
        if user_response == 'yes':
            for symptom, question in checker.symptoms.items():
                if question == next_question:
                    symptoms.append(next_question)
                    break
        elif user_response == 'no':
            pass  # Do nothing
        else:
            print("Invalid response. Please answer 'yes' or 'no'.")
            continue

        diagnosis = checker.diagnose(symptoms)
        print("Diagnosis:", diagnosis)
        break
