// services/roleService.js
const { Provider } = require("../models");
const { assert } = require("./assert");

async function getProviderByUser(userId) {
  if (!userId) return null;
  return Provider.findOne({
    where: { userId },
    attributes: ["id", "userId", "businessName"],
  });
}
async function getMechanicByUser(userId) {
  if (!userId) return null;
  const { Mechanic } = require("../models");
  return Mechanic.findOne({
    where: { userId },
    attributes: ["id", "userId", "providerId"],
  });
}

/**
 * Resolve provider context for actions that can be performed by provider or admin.
 * - provider user: uses their own provider id
 * - admin user: uses sr.providerId or bodyProviderId
 * Options:
 *  - bodyProviderId: preferred when admin wants to attach/override
 *  - requireExisting: if true, must end up with a providerId
 */
async function resolveProviderForAdminOrProvider({
  req,
  sr,
  bodyProviderId,
  requireExisting = true,
}) {
  let provider = null;
  let providerId = null;

  if (req.user.role === "provider") {
    provider = await getProviderByUser(req.user.id);
    assert(provider, 403, "Provider profile not found");
    providerId = provider.id;
  } else if (req.user.role === "admin") {
    providerId = bodyProviderId || sr?.providerId || null;
    if (providerId) {
      provider = await Provider.findByPk(providerId, {
        attributes: ["id", "businessName"],
      });
      assert(provider, 404, "Provider not found");
    } else if (requireExisting) {
      assert(false, 400, "providerId is required for admin");
    }
  } else {
    assert(false, 403, "Forbidden");
  }

  return { provider, providerId };
}

module.exports = {
  getProviderByUser,
  getMechanicByUser,
  resolveProviderForAdminOrProvider,
};
