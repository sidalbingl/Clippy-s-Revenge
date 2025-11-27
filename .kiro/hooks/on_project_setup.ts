export default async function onProjectSetup(ctx) {
  ctx.log("Clippy's Revenge environment initialized.");
  ctx.setState("project_initialized", true);
}
