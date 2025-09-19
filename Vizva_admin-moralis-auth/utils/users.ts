/**
 *
 * @param users
 * @description this function is used to group the users by the months they were created
 * @returns {number[]}
 */
export function getUsersCreatedMonth(users: any[]) {
  let monthsUsersWereCreated: number[] = [];
  if (users.length > 0) {
    // gets the months the users were created and sort them [0,0,1,1,1,2,3,4,4,4,4, ...]
    const date = users
      .map((user) => new Date(user.createdAt).getMonth())
      .sort();

    // holds the count for each month
    let count = 0;
    // holds the number of users in each month
    let data = [];

    for (let i = 0; i < date.length; i++) {
      let elem = date[i];
      // if the month is the same as the previous month or the first month
      if ((i != 0 && elem == date[i - 1]) || i == 0) {
        count++;
        // if this is the last element
        if (i == date.length - 1) data.push(count);
      }
      // if the month is different from the previous month and isn't the first month
      else if (i != 0 && elem != date[i - 1]) {
        data.push(count);
        count = 1;
      }
      // if the month is different from the previous month and is the first month
      else {
        data.push(count);
      }
    }
    // fill the array with 0's to have the same length as the months
    for (let i = data.length; i < 7; i++) {
      data.push(0);
    }
    monthsUsersWereCreated = data;
  }
  return monthsUsersWereCreated;
}
