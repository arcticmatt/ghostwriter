describe("smoke tests", () => {
  it("should render the root", () => {
    cy.visitAndCheck("/");
  });
});
