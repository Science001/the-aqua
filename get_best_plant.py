import sys

numbers = [int(val) for val in sys.argv[1].split(',')]
voc_importance = {0:0.1,1:0.1,2:0.1,3:0.1}
plant_details = [[0.9,0.1,0.0,0],[0.0,0.8,0.1,0.1],[0.1,0.1,0.8,0.0],[0.0,0.1,0,0.9],[0,0.2,0.4,0.4]]
plant_names = {0:"Areca palm",1:"Bamboo palm",2:"Tulasi",3:"Lady Palm",4:"Rhapis excelsa"}


def calculate_loss(individual_plant_details,ratios):
  individual_plant_details = [100*i for i in individual_plant_details]
  ratios = [100*i for i in ratios]
  loss = 0
  for i in range(len(individual_plant_details)):
    # print("a",voc_importance[i])
    # print("b",individual_plant_details[i]-ratios[i])
    loss = loss + voc_importance[i]*(individual_plant_details[i]-ratios[i])*(individual_plant_details[i]-ratios[i])
  return loss

def get_ratios_from_numbers(numbers):
  voc_frequencies = [0,0,0,0]
  voc_frequencies[0] = numbers[0] + numbers[1]
  voc_frequencies[1] = numbers[2] + numbers[6]
  voc_frequencies[2] = numbers[4] + numbers[5]
  voc_frequencies[3] = numbers[3]
  sum_voc_conc = sum(voc_frequencies)
  voc_frequencies = [i*(1/sum_voc_conc) for i in voc_frequencies]
  return voc_frequencies

def get_plant(numbers):
  ratios = get_ratios_from_numbers(numbers)
  losses = []
  for i in plant_details:
    losses.append(calculate_loss(i,ratios))
  suitable_plant = losses.index(min(losses))
  return suitable_plant

print(get_plant(numbers))
sys.stdout.flush()