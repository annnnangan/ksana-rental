exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const equipmentSetOne = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]; //no shared-washroom
  const equipmentSetTwo = [1, 2, 3, 4, 5, 6, 8, 10, 11, 13]; //no silk, no individual-washroom, no lighting
  const equipmentSetThree = [1, 2, 3, 9, 11, 13]; // no hammock, no spinning-hammock, no hoop, no silk, no safety-mat, no shared-washroom, no lighting
  const equipmentSetFour = [1, 3, 10, 11];

  const studioGroups = [
    { studios: [1, 2, 3, 4, 7, 15], equipment: equipmentSetOne },
    { studios: [5, 6, 16, 17, 10], equipment: equipmentSetTwo },
    { studios: [11, 12, 13, 14, 8], equipment: equipmentSetThree },
    { studios: [9, 18, 19], equipment: equipmentSetFour },
  ];

  await knex("studio_equipment").del();

  const studioEquipmentData = [];

  studioGroups.forEach(({ studios, equipment }) => {
    studios.forEach((studioId) => {
      equipment.forEach((equipmentId) => {
        studioEquipmentData.push({ studio_id: studioId, equipment_id: equipmentId });
      });
    });
  });

  await knex("studio_equipment").insert(studioEquipmentData);
};
