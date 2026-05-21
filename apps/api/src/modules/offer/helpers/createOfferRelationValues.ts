export function createOfferRelationValues<ColumnName extends string>(
  offerId: number,
  relationColumnName: ColumnName,
  relationIds: number[],
) {
  return relationIds.map((relationId) => ({
    offer_id: offerId,
    [relationColumnName]: relationId,
  })) as Array<{ offer_id: number } & Record<ColumnName, number>>;
}
